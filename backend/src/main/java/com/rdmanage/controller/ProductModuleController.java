package com.rdmanage.controller;

import com.rdmanage.dto.CreateProductModuleRequest;
import com.rdmanage.dto.UpdateProductModuleRequest;
import com.rdmanage.model.ProductModule;
import com.rdmanage.service.ProductModuleService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/modules")
@Validated
public class ProductModuleController {
  private final ProductModuleService productModuleService;

  public ProductModuleController(ProductModuleService productModuleService) {
    this.productModuleService = productModuleService;
  }

  @GetMapping
  public List<ProductModule> list(
      @RequestParam(required = false) Long productId,
      @RequestParam(required = false) Long parentId) {
    return productModuleService.list(productId, parentId);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductModule> get(@PathVariable Long id) {
    ProductModule module = productModuleService.get(id);
    if (module == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(module);
  }

  @PostMapping
  public ResponseEntity<ProductModule> create(
      @Valid @RequestBody CreateProductModuleRequest request) {
    try {
      return ResponseEntity.status(HttpStatus.CREATED).body(productModuleService.create(request));
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductModule> update(
      @PathVariable Long id, @RequestBody UpdateProductModuleRequest request) {
    try {
      ProductModule module = productModuleService.update(id, request);
      if (module == null) {
        return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(module);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    boolean deleted = productModuleService.delete(id);
    if (!deleted) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }
}
