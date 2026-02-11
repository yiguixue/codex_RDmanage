package com.rdmanage.dto;

import java.time.LocalDate;

public class UpdateRequirementRequest {
  private Long productId;
  private Long moduleId;
  private String name;
  private String description;
  private String priority;
  private String status;
  private Long versionId;
  private String owner;
  private LocalDate dueDate;
  private Integer estimateStoryPoints;

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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getPriority() {
    return priority;
  }

  public void setPriority(String priority) {
    this.priority = priority;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Long getVersionId() {
    return versionId;
  }

  public void setVersionId(Long versionId) {
    this.versionId = versionId;
  }

  public String getOwner() {
    return owner;
  }

  public void setOwner(String owner) {
    this.owner = owner;
  }

  public LocalDate getDueDate() {
    return dueDate;
  }

  public void setDueDate(LocalDate dueDate) {
    this.dueDate = dueDate;
  }

  public Integer getEstimateStoryPoints() {
    return estimateStoryPoints;
  }

  public void setEstimateStoryPoints(Integer estimateStoryPoints) {
    this.estimateStoryPoints = estimateStoryPoints;
  }
}
