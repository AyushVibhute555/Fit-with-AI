package com.fitness.gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutingConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // 1. User Service
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://USER-SERVICE"))

                // 2. Activity Service
                .route("activity-service", r -> r.path("/api/activities/**")
                        .uri("lb://ACTIVITY-SERVICE"))

                // 3. AI Service
                .route("ai-service", r -> r.path("/api/recommendations/**")
                        .uri("lb://AI-SERVICE"))
                .build();
    }
}