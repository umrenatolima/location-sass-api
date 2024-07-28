# App

A gym sass api with features inspired by gympass. This is a simple personal study implementind SOLID principles in a fully tested nodejs project with geo map and RBAC features.

# Tech Stack

This application is built with nodejs, typescript, fastify, prisma ORM, PostgreSQL, docker and more.

## Functional Requirements

- [] Should be able to register a new account
- [] Should be able to authenticate an user
- [] Should be able to fetch profile of an authenticated user
- [] Should be able to fetch number of check-ins completed by the authenticated user
- [] User should be able to fetch check-in history
- [] User should be able to search for nearby gyms
- [] User should be able to search for gyms by name
- [] User should be able to check-in at a gym
- [] Should be able to validate an user check-in
- [] Should be able to register a new academy

## Business Rules

- [] User should not be able to register with an email that is already in use
- [] User should not be able to check-in twice on the same day
- [] User should not be able to check-in at a gym that is farther than 100m away
- [] Should not be able to validate a check-in after 20min
- [] Should only be able to validate a check-in if user is an ADMIN
- [] Should only be able to register a new gym if user is an ADMIN

## Non-Functional Requirements

- [] User password should be crytographed
- [] Data should be stored in a PostgreSQL DB
- [] All data list should be paginated by 20 items per page
- [] User should be authenticated via JWT
