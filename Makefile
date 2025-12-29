.PHONY: help install up down build logs migrate seed test clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

build: ## Build the application
	npm run build

logs: ## View application logs
	docker-compose logs -f app

migrate: ## Run database migrations
	npm run migration:run

seed: ## Seed the database
	npm run seed

test: ## Run tests
	npm run test

test-cov: ## Run tests with coverage
	npm run test:cov

test-e2e: ## Run e2e tests
	npm run test:e2e

dev: ## Start development server
	npm run start:dev

clean: ## Clean up containers and volumes
	docker-compose down -v
	rm -rf node_modules dist

restart: down up ## Restart all services

setup: install up migrate seed ## Complete setup (install, start, migrate, seed)
