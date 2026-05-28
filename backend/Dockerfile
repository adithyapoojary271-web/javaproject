# Step 1: Build the application using Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Run the application using Eclipse Temurin (Supported & Active)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/excel-core-bank-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
