package com.rdmanage.menu;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MenuConfigService {
  private static final TypeReference<List<MenuConfigItem>> LIST_TYPE = new TypeReference<>() {};
  private final ObjectMapper objectMapper;
  private final Path configPath = Paths.get("data", "menu-config.json");

  public MenuConfigService(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public List<MenuConfigItem> load() {
    if (!Files.exists(configPath)) {
      List<MenuConfigItem> defaults = defaultConfig();
      save(defaults);
      return defaults;
    }
    try {
      List<MenuConfigItem> items = normalize(objectMapper.readValue(configPath.toFile(), LIST_TYPE));
      if (items == null || items.isEmpty()) {
        List<MenuConfigItem> defaults = defaultConfig();
        save(defaults);
        return defaults;
      }
      return items;
    } catch (IOException ex) {
      List<MenuConfigItem> defaults = defaultConfig();
      save(defaults);
      return defaults;
    }
  }

  public void save(List<MenuConfigItem> items) {
    try {
      Files.createDirectories(configPath.getParent());
      objectMapper.writerWithDefaultPrettyPrinter().writeValue(configPath.toFile(), normalize(items));
    } catch (IOException ex) {
      throw new IllegalStateException("保存菜单配置失败", ex);
    }
  }

  private List<MenuConfigItem> defaultConfig() {
    List<MenuConfigItem> items = new ArrayList<>();
    items.add(menu("overview", "概览", "概览", "overview"));

    MenuConfigItem products = menu("productGroup", "产品管理", "产品管理", "products");
    List<MenuConfigItem> productChildren = new ArrayList<>();
    productChildren.add(menu("products", "产品管理", "产品管理", "products"));
    productChildren.add(menu("modules", "功能模块", "功能模块", "modules"));
    productChildren.add(menu("versions", "版本管理", "版本管理", "versions"));
    products.setChildren(productChildren);
    items.add(products);

    items.add(menu("requirements", "需求管理", "需求管理", "requirements"));
    items.add(menu("tasks", "任务管理", "任务管理", "tasks"));
    items.add(menu("reports", "数据报表", "数据报表", "reports"));

    MenuConfigItem system = menu("system", "系统管理", "系统管理", "system");
    List<MenuConfigItem> children = new ArrayList<>();
    children.add(menu("settings", "应用设置", "应用设置", "settings"));
    children.add(menu("menus", "菜单管理", "菜单管理", "menus"));
    children.add(menu("dicts", "字典管理", "字典管理", "dicts"));
    system.setChildren(children);
    items.add(system);
    return items;
  }

  private MenuConfigItem menu(String key, String label, String title, String iconKey) {
    MenuConfigItem item = new MenuConfigItem();
    item.setKey(key);
    item.setLabel(label);
    item.setTitle(title);
    item.setIconKey(iconKey);
    return item;
  }

  private List<MenuConfigItem> normalize(List<MenuConfigItem> items) {
    if (items == null) {
      return null;
    }
    List<MenuConfigItem> normalized = new ArrayList<>();
    for (MenuConfigItem item : items) {
      if (item == null) {
        continue;
      }
      if (item.getChildren() != null && !item.getChildren().isEmpty()) {
        boolean hasDuplicateKey = item.getChildren().stream().anyMatch(child -> child != null && item.getKey() != null && item.getKey().equals(child.getKey()));
        if (hasDuplicateKey && "products".equals(item.getKey())) {
          item.setKey("productGroup");
        }
      }
      normalized.add(item);
    }
    return normalized;
  }
}
