package com.fitness.aiservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiserviceApplication {

	public static void main(String[] args) {
		// Add this single line to force IPv4 DNS resolution!
		System.setProperty("java.net.preferIPv4Stack", "true");

		SpringApplication.run(AiserviceApplication.class, args);
	}

}