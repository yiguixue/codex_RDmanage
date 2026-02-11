package com.rdmanage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateRequirementRequest {
  @NotNull
  private Long productId;

  @NotNull
  private Long moduleId;

  @NotBlank
  private String code;

  @NotBlank
  private String name;

  private String description;

  @NotBlank
  private String priority;

  @NotNull
  private Long versionId;

  @NotBlank
  private String owner;

  private LocalDate dueDate;
  private Integer estimateStoryPoints;

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
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
