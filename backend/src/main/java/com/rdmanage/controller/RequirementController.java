package com.rdmanage.controller;

import com.rdmanage.dto.CreateRequirementRequest;
import com.rdmanage.dto.UpdateRequirementRequest;
import com.rdmanage.model.Requirement;
import com.rdmanage.service.RequirementService;
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
@RequestMapping("/api/requirements")
@Validated
public class RequirementController {
  private final RequirementService requirementService;

  public RequirementController(RequirementService requirementService) {
    this.requirementService = requirementService;
  }

  @GetMapping
  public List<Requirement> list(
      @RequestParam(required = false) Long productId,
      @RequestParam(required = false) Long moduleId) {
    return requirementService.list(productId, moduleId);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Requirement> get(@PathVariable Long id) {
    Requirement requirement = requirementService.get(id);
    if (requirement == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(requirement);
  }

  @PostMapping
  public ResponseEntity<Requirement> create(@Valid @RequestBody CreateRequirementRequest request) {
    try {
      return ResponseEntity.status(HttpStatus.CREATED).body(requirementService.create(request));
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Requirement> update(
      @PathVariable Long id, @RequestBody UpdateRequirementRequest request) {
    try {
      Requirement requirement = requirementService.update(id, request);
      if (requirement == null) {
        return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(requirement);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    boolean deleted = requirementService.delete(id);
    if (!deleted) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }
}
