package com.fitness.aiservice.service;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {

        String prompt = createPromptForActivity(activity);

        log.info("Sending prompt to Gemini AI...");

        String aiResponse = geminiService.getAnswer(prompt);

        log.info("Raw Response from Gemini AI: {}", aiResponse);

        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {

        try {

            JsonMapper mapper = JsonMapper.builder()
                    .enable(JsonReadFeature.ALLOW_TRAILING_COMMA)
                    .build();

            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            // Fix invalid JSON returned by AI
            jsonContent = jsonContent.replaceAll(",\\s*}", "}");
            jsonContent = jsonContent.replaceAll(",\\s*]", "]");

            log.info("Parsed JSON from AI: {}", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent);

            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();

            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall: ");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace: ");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate: ");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories Burned: ");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestion(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuideline(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestion(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {

            log.error("Error parsing AI response", e);

            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {

        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType() != null ? activity.getType() : "UNKNOWN")
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestion(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuideline(JsonNode safetyNode) {

        List<String> safety = new ArrayList<>();

        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }

        return safety.isEmpty()
                ? Collections.singletonList("Follow general safety guidelines and stay healthy.")
                : safety;
    }

    private List<String> extractSuggestion(JsonNode suggestionNode) {

        List<String> suggestions = new ArrayList<>();

        if (suggestionNode.isArray()) {

            suggestionNode.forEach(suggestion -> {

                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();

                suggestions.add(String.format("%s: %s", workout, description));
            });
        }

        return suggestions.isEmpty()
                ? Collections.singletonList("No specific workout suggestions provided")
                : suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {

        List<String> improvements = new ArrayList<>();

        if (improvementsNode.isArray()) {

            improvementsNode.forEach(improvement -> {

                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();

                improvements.add(String.format("%s: %s", area, detail));
            });
        }

        return improvements.isEmpty()
                ? Collections.singletonList("No specific improvements provided")
                : improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis,
                                    JsonNode analysisNode,
                                    String key,
                                    String prefix) {

        if (!analysisNode.path(key).isMissingNode()) {

            fullAnalysis
                    .append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {

        String metrics = activity.getAdditionalMetrics() != null
                ? activity.getAdditionalMetrics().toString()
                : "No additional metrics";

        Integer duration = activity.getDuration() != null
                ? activity.getDuration()
                : 0;

        Integer calories = activity.getCaloriesBurned() != null
                ? activity.getCaloriesBurned()
                : 0;

        String type = activity.getType() != null
                ? activity.getType()
                : "Unknown";

        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:

        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:

        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s

        IMPORTANT:
        - Return ONLY valid JSON
        - Do NOT include markdown
        - Do NOT include explanations
        - Follow EXACT structure
        """,
                type,
                duration,
                calories,
                metrics
        );
    }
}