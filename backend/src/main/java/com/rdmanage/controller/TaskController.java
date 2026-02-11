package com.rdmanage.controller;

import com.rdmanage.dto.CreateTaskRequest;
import com.rdmanage.dto.UpdateTaskRequest;
import com.rdmanage.model.TaskItem;
import com.rdmanage.service.TaskService;
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
@RequestMapping("/api/tasks")
@Validated
public class TaskController {
  private final TaskService taskService;

  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }

  @GetMapping
  public List<TaskItem> list(
      @RequestParam(required = false) Long productId,
      @RequestParam(required = false) Long moduleId) {
    return taskService.list(productId, moduleId);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TaskItem> get(@PathVariable Long id) {
    TaskItem task = taskService.get(id);
    if (task == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(task);
  }

  @PostMapping
  public ResponseEntity<TaskItem> create(@Valid @RequestBody CreateTaskRequest request) {
    try {
      return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(request));
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskItem> update(
      @PathVariable Long id, @RequestBody UpdateTaskRequest request) {
    try {
      TaskItem task = taskService.update(id, request);
      if (task == null) {
        return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(task);
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    boolean deleted = taskService.delete(id);
    if (!deleted) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }
}
