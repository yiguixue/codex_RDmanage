package com.rdmanage.menu;

import java.util.List;

public class MenuConfigItem {
  private String key;
  private String label;
  private String title;
  private String iconKey;
  private String iconDataUrl;
  private List<MenuConfigItem> children;

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getIconKey() {
    return iconKey;
  }

  public void setIconKey(String iconKey) {
    this.iconKey = iconKey;
  }

  public String getIconDataUrl() {
    return iconDataUrl;
  }

  public void setIconDataUrl(String iconDataUrl) {
    this.iconDataUrl = iconDataUrl;
  }

  public List<MenuConfigItem> getChildren() {
    return children;
  }

  public void setChildren(List<MenuConfigItem> children) {
    this.children = children;
  }
}
