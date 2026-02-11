package com.rdmanage.dto;

public class DictItemRequest {
  private String dictType;
  private String dictCode;
  private String dictLabel;
  private Integer sortOrder;
  private Integer isActive;
  private String remark;

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
}
