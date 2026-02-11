package com.rdmanage.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "dict_item")
public class DictItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "dict_type", nullable = false, length = 64)
  private String dictType;

  @Column(name = "dict_code", nullable = false, length = 64)
  private String dictCode;

  @Column(name = "dict_label", nullable = false, length = 128)
  private String dictLabel;

  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder;

  @Column(name = "is_active", nullable = false)
  private Integer isActive;

  @Column(length = 255)
  private String remark;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  public void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  public void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getDictType() {
    return dictType;
  }

  public void setDictType(String dictType) {
    this.dictType = dictType;
  }

  public String getDictCode() {
    return dictCode;
  }

  public void setDictCode(String dictCode) {
    this.dictCode = dictCode;
  }

  public String getDictLabel() {
    return dictLabel;
  }

  public void setDictLabel(String dictLabel) {
    this.dictLabel = dictLabel;
  }

  public Integer getSortOrder() {
    return sortOrder;
  }

  public void setSortOrder(Integer sortOrder) {
    this.sortOrder = sortOrder;
  }

  public Integer getIsActive() {
    return isActive;
  }

  public void setIsActive(Integer isActive) {
    this.isActive = isActive;
  }

  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
