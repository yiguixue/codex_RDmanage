package com.rdmanage.controller;

import com.rdmanage.dto.CreateVersionRequest;
import com.rdmanage.dto.UpdateVersionRequest;
import com.rdmanage.model.VersionInfo;
import com.rdmanage.service.VersionService;
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
@RequestMapping("/api/versions")
@Validated
public class VersionController {
  private final VersionService versionService;

  public VersionController(VersionService versionService) {
    this.versionService = versionService;
  }

  @GetMapping
  public List<VersionInfo> list(
      @RequestParam(required = false) Long productId,
      @RequestParam(required = false) Long moduleId) {
    return versionService.list(productId, moduleId);
  }

  @GetMapping("/{id}")
  public ResponseEntity<VersionInfo> get(@PathVariable Long id) {
    VersionInfo version = versionService.get(id);
    if (version == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(version);
  }

  @PostMapping
  public ResponseEntity<VersionInfo> create(@Valid @RequestBody CreateVersionRequest request) {
    try {
      return ResponseEntity.status(HttpStatus.CREATED).body(versionService.create(request));
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<VersionInfo> update(
      @PathVariable Long id, @RequestBody UpdateVersionRequest request) {
    try {
      VersionInfo version = versionService.update(id, request);
      if (version == null) {
        return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(version);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    try {
      boolean deleted = versionService.delete(id);
      if (!deleted) {
        return ResponseEntity.notFound().build();
      }
      return ResponseEntity.noContent().build();
    } catch (IllegalStateException ex) {
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
  }
}
