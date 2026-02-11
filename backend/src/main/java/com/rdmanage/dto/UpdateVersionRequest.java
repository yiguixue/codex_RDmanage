package com.rdmanage.dto;

import java.time.LocalDate;

public class UpdateVersionRequest {
  private Long productId;
  private Long moduleId;
  private String name;
  private String owner;
  private LocalDate planReleaseDate;
  private LocalDate actualReleaseDate;
  private String status;
  private String description;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  public Long getModuleId() {
    return moduleId;
  }

  public void setModuleId(Long moduleId) {
    this.moduleId = moduleId;
  }

  public String getOwner() {
    return owner;
  }

  public void setOwner(String owner) {
    this.owner = owner;
  }

  public LocalDate getPlanReleaseDate() {
    return planReleaseDate;
  }

  public void setPlanReleaseDate(LocalDate planReleaseDate) {
    this.planReleaseDate = planReleaseDate;
  }

  public LocalDate getActualReleaseDate() {
    return actualReleaseDate;
  }

  public void setActualReleaseDate(LocalDate actualReleaseDate) {
    this.actualReleaseDate = actualReleaseDate;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
