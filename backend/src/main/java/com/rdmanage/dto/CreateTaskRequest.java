package com.rdmanage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateTaskRequest {
  @NotNull
  private Long productId;

  @NotNull
  private Long moduleId;

  @NotNull
  private Long requirementId;

  @NotBlank
  private String title;

  private String description;

  @NotBlank
  private String assignee;

  private LocalDate dueDate;
  private Integer estimateHours;

  public Long getRequirementId() {
    return requirementId;
  }

  public void setRequirementId(Long requirementId) {
    this.requirementId = requirementId;
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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getAssignee() {
    return assignee;
  }

  public void setAssignee(String assignee) {
    this.assignee = assignee;
  }

  public LocalDate getDueDate() {
    return dueDate;
  }

  public void setDueDate(LocalDate dueDate) {
    this.dueDate = dueDate;
  }

  public Integer getEstimateHours() {
    return estimateHours;
  }

  public void setEstimateHours(Integer estimateHours) {
    this.estimateHours = estimateHours;
  }
}
