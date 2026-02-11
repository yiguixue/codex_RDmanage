package com.rdmanage.controller;

import com.rdmanage.dto.CreateProductRequest;
import com.rdmanage.dto.UpdateProductRequest;
import com.rdmanage.model.Product;
import com.rdmanage.service.ProductService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@Validated
public class ProductController {
  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public List<Product> list() {
    return productService.list();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Product> get(@PathVariable Long id) {
    Product product = productService.get(id);
    if (product == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(product);
  }

  @PostMapping
  public ResponseEntity<Product> create(@Valid @RequestBody CreateProductRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody UpdateProductRequest request) {
    Product product = productService.update(id, request);
    if (product == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(product);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    boolean deleted = productService.delete(id);
    if (!deleted) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }
}
