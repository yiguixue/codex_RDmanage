package com.rdmanage.service;

import com.rdmanage.dto.CreateRequirementRequest;
import com.rdmanage.dto.UpdateRequirementRequest;
import com.rdmanage.model.Requirement;
import com.rdmanage.model.ProductModule;
import com.rdmanage.repository.ProductModuleRepository;
import com.rdmanage.repository.ProductRepository;
import com.rdmanage.repository.RequirementRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RequirementService {
  private final RequirementRepository requirementRepository;
  private final ProductRepository productRepository;
  private final ProductModuleRepository productModuleRepository;

  public RequirementService(
      RequirementRepository requirementRepository,
      ProductRepository productRepository,
      ProductModuleRepository productModuleRepository) {
    this.requirementRepository = requirementRepository;
    this.productRepository = productRepository;
    this.productModuleRepository = productModuleRepository;
  }

  public List<Requirement> list(Long productId, Long moduleId) {
    if (productId == null) {
      return requirementRepository.findAll();
    }
    if (moduleId == null) {
      return requirementRepository.findByProductId(productId);
    }
    return requirementRepository.findByProductIdAndModuleId(productId, moduleId);
  }

  public Requirement get(Long id) {
    return requirementRepository.findById(id).orElse(null);
  }

  public Requirement create(CreateRequirementRequest request) {
    validateProductModule(request.getProductId(), request.getModuleId());
    Requirement requirement = new Requirement();
    requirement.setProductId(request.getProductId());
    requirement.setModuleId(request.getModuleId());
    requirement.setCode(request.getCode());
    requirement.setName(request.getName());
    requirement.setDescription(request.getDescription());
    requirement.setPriority(request.getPriority());
    requirement.setStatus("DRAFT");
    requirement.setVersionId(request.getVersionId());
    requirement.setOwner(request.getOwner());
    requirement.setDueDate(request.getDueDate());
    requirement.setEstimateStoryPoints(request.getEstimateStoryPoints());
    return requirementRepository.save(requirement);
  }

  public Requirement update(Long id, UpdateRequirementRequest request) {
    Requirement requirement = requirementRepository.findById(id).orElse(null);
    if (requirement == null) {
      return null;
    }
    Long productId =
        request.getProductId() != null ? request.getProductId() : requirement.getProductId();
    Long moduleId =
        request.getModuleId() != null ? request.getModuleId() : requirement.getModuleId();
    validateProductModule(productId, moduleId);
    if (request.getProductId() != null) {
      requirement.setProductId(request.getProductId());
    }
    if (request.getModuleId() != null) {
      requirement.setModuleId(request.getModuleId());
    }
    if (request.getName() != null) {
      requirement.setName(request.getName());
    }
    if (request.getDescription() != null) {
      requirement.setDescription(request.getDescription());
    }
    if (request.getPriority() != null && !request.getPriority().isBlank()) {
      requirement.setPriority(request.getPriority());
    }
    if (request.getStatus() != null && !request.getStatus().isBlank()) {
      requirement.setStatus(request.getStatus());
    }
    if (request.getVersionId() != null) {
      requirement.setVersionId(request.getVersionId());
    }
    if (request.getOwner() != null) {
      requirement.setOwner(request.getOwner());
    }
    if (request.getDueDate() != null) {
      requirement.setDueDate(request.getDueDate());
    }
    if (request.getEstimateStoryPoints() != null) {
      requirement.setEstimateStoryPoints(request.getEstimateStoryPoints());
    }
    return requirementRepository.save(requirement);
  }

  public boolean delete(Long id) {
    if (!requirementRepository.existsById(id)) {
      return false;
    }
    requirementRepository.deleteById(id);
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
