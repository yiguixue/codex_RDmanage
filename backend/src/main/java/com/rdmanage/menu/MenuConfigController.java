package com.rdmanage.menu;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menu-config")
public class MenuConfigController {
  private final MenuConfigService menuConfigService;

  public MenuConfigController(MenuConfigService menuConfigService) {
    this.menuConfigService = menuConfigService;
  }

  @GetMapping
  public List<MenuConfigItem> get() {
    return menuConfigService.load();
  }

  @PutMapping
  public ResponseEntity<Void> update(@RequestBody List<MenuConfigItem> items) {
    menuConfigService.save(items);
    return ResponseEntity.noContent().build();
  }
}
