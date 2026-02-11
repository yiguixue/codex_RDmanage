package com.rdmanage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateVersionRequest {
  @NotNull
  private Long productId;

  @NotNull
  private Long moduleId;

  @NotBlank
  private String versionCode;

  @NotBlank
  private String name;

  @NotBlank
  private String owner;

  @NotNull
  private LocalDate planReleaseDate;

  private String description;

  public String getVersionCode() {
    return versionCode;
  }

  public void setVersionCode(String versionCode) {
    this.versionCode = versionCode;
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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
