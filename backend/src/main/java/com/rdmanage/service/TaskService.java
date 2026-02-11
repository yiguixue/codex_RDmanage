package com.rdmanage.service;

import com.rdmanage.dto.CreateTaskRequest;
import com.rdmanage.dto.UpdateTaskRequest;
import com.rdmanage.model.TaskItem;
import com.rdmanage.model.ProductModule;
import com.rdmanage.repository.ProductModuleRepository;
import com.rdmanage.repository.ProductRepository;
import com.rdmanage.repository.TaskItemRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TaskService {
  private final TaskItemRepository taskItemRepository;
  private final ProductRepository productRepository;
  private final ProductModuleRepository productModuleRepository;

  public TaskService(
      TaskItemRepository taskItemRepository,
      ProductRepository productRepository,
      ProductModuleRepository productModuleRepository) {
    this.taskItemRepository = taskItemRepository;
    this.productRepository = productRepository;
    this.productModuleRepository = productModuleRepository;
  }

  public List<TaskItem> list(Long productId, Long moduleId) {
    if (productId == null) {
      return taskItemRepository.findAll();
    }
    if (moduleId == null) {
      return taskItemRepository.findByProductId(productId);
    }
    return taskItemRepository.findByProductIdAndModuleId(productId, moduleId);
  }

  public TaskItem get(Long id) {
    return taskItemRepository.findById(id).orElse(null);
  }

  public TaskItem create(CreateTaskRequest request) {
    validateProductModule(request.getProductId(), request.getModuleId());
    TaskItem task = new TaskItem();
    task.setProductId(request.getProductId());
    task.setModuleId(request.getModuleId());
    task.setRequirementId(request.getRequirementId());
    task.setTitle(request.getTitle());
    task.setDescription(request.getDescription());
    task.setAssignee(request.getAssignee());
    task.setDueDate(request.getDueDate());
    task.setEstimateHours(request.getEstimateHours());
    task.setStatus("TODO");
    return taskItemRepository.save(task);
  }

  public TaskItem update(Long id, UpdateTaskRequest request) {
    TaskItem task = taskItemRepository.findById(id).orElse(null);
    if (task == null) {
      return null;
    }
    Long productId =
        request.getProductId() != null ? request.getProductId() : task.getProductId();
    Long moduleId =
        request.getModuleId() != null ? request.getModuleId() : task.getModuleId();
    validateProductModule(productId, moduleId);
    if (request.getProductId() != null) {
      task.setProductId(request.getProductId());
    }
    if (request.getModuleId() != null) {
      task.setModuleId(request.getModuleId());
    }
    if (request.getTitle() != null) {
      task.setTitle(request.getTitle());
    }
    if (request.getDescription() != null) {
      task.setDescription(request.getDescription());
    }
    if (request.getAssignee() != null) {
      task.setAssignee(request.getAssignee());
    }
    if (request.getStatus() != null && !request.getStatus().isBlank()) {
      task.setStatus(request.getStatus());
    }
    if (request.getDueDate() != null) {
      task.setDueDate(request.getDueDate());
    }
    if (request.getEstimateHours() != null) {
      task.setEstimateHours(request.getEstimateHours());
    }
    return taskItemRepository.save(task);
  }

  public boolean delete(Long id) {
    if (!taskItemRepository.existsById(id)) {
      return false;
    }
    taskItemRepository.deleteById(id);
    return true;
  }

  private void validateProductModule(Long productId, Long moduleId) {
    if (productId == null || !productRepository.existsById(productId)) {
      throw new IllegalArgumentException("产品不存在");
    }
    if (moduleId == null) {
      throw new IllegalArgumentException("功能模块不能为空");
    }
    ProductModule module = productModuleRepository.findById(moduleId).orElse(null);
    if (module == null) {
      throw new IllegalArgumentException("功能模块不存在");
    }
    if (!module.getProductId().equals(productId)) {
      throw new IllegalArgumentException("功能模块不属于该产品");
    }
  }
}
