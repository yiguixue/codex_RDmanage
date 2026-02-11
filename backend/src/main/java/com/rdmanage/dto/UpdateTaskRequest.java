package com.rdmanage.dto;

import java.time.LocalDate;

public class UpdateTaskRequest {
  private Long productId;
  private Long moduleId;
  private String title;
  private String description;
  private String assignee;
  private String status;
  private LocalDate dueDate;
  private Integer estimateHours;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
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

  public String getAssignee() {
    return assignee;
  }

  public void setAssignee(String assignee) {
    this.assignee = assignee;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
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
