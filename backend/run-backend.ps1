Set-Location "$PSScriptRoot"
$env:JAVA_HOME = "C:\Dev\temurin17\jdk-17.0.18+8"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
& "C:\Dev\maven\apache-maven-3.9.6\bin\mvn.cmd" -DskipTests spring-boot:run
