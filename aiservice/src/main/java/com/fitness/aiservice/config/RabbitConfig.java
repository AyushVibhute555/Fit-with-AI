package com.fitness.aiservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // Queue
    @Bean
    public Queue activityQueue(){
        return new Queue("activity.queue", true);
    }

    // Exchange
    @Bean
    public TopicExchange exchange(){
        return new TopicExchange("fitness.exchange");
    }

    // Binding
    @Bean
    public Binding binding(Queue activityQueue, TopicExchange exchange){
        return BindingBuilder
                .bind(activityQueue)
                .to(exchange)
                .with("activity.tracking");
    }

    // JSON Converter
    @Bean
    public MessageConverter jsonMessageConverter(){
        return new Jackson2JsonMessageConverter();
    }
}