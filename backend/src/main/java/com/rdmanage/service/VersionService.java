package com.rdmanage.service;

import com.rdmanage.dto.CreateVersionRequest;
import com.rdmanage.dto.UpdateVersionRequest;
import com.rdmanage.model.VersionInfo;
import com.rdmanage.model.ProductModule;
import com.rdmanage.repository.ProductModuleRepository;
import com.rdmanage.repository.ProductRepository;
import com.rdmanage.repository.RequirementRepository;
import com.rdmanage.repository.VersionRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VersionService {
  private final VersionRepository versionRepository;
  private final ProductRepository productRepository;
  private final ProductModuleRepository productModuleRepository;
  private final RequirementRepository requirementRepository;

  public VersionService(
      VersionRepository versionRepository,
      ProductRepository productRepository,
      ProductModuleRepository productModuleRepository,
      RequirementRepository requirementRepository) {
    this.versionRepository = versionRepository;
    this.productRepository = productRepository;
    this.productModuleRepository = productModuleRepository;
    this.requirementRepository = requirementRepository;
  }

  public List<VersionInfo> list(Long productId, Long moduleId) {
    if (productId == null) {
      return versionRepository.findAll();
    }
    if (moduleId == null) {
      return versionRepository.findByProductId(productId);
    }
    return versionRepository.findByProductIdAndModuleId(productId, moduleId);
  }

  public VersionInfo get(Long id) {
    return versionRepository.findById(id).orElse(null);
  }

  public VersionInfo create(CreateVersionRequest request) {
    validateProductModule(request.getProductId(), request.getModuleId());
    VersionInfo version = new VersionInfo();
    version.setProductId(request.getProductId());
    version.setModuleId(request.getModuleId());
    version.setVersionCode(request.getVersionCode());
    version.setName(request.getName());
    version.setOwner(request.getOwner());
    version.setPlanReleaseDate(request.getPlanReleaseDate());
    version.setDescription(request.getDescription());
    version.setStatus("PLANNED");
    return versionRepository.save(version);
  }

  public VersionInfo update(Long id, UpdateVersionRequest request) {
    VersionInfo version = versionRepository.findById(id).orElse(null);
    if (version == null) {
      return null;
    }
    Long productId = request.getProductId() != null ? request.getProductId() : version.getProductId();
    Long moduleId = request.getModuleId() != null ? request.getModuleId() : version.getModuleId();
    validateProductModule(productId, moduleId);
    if (request.getProductId() != null) {
      version.setProductId(request.getProductId());
    }
    if (request.getModuleId() != null) {
      version.setModuleId(request.getModuleId());
    }
    if (request.getName() != null) {
      version.setName(request.getName());
    }
    if (request.getOwner() != null) {
      version.setOwner(request.getOwner());
    }
    if (request.getPlanReleaseDate() != null) {
      version.setPlanReleaseDate(request.getPlanReleaseDate());
    }
    if (request.getActualReleaseDate() != null) {
      version.setActualReleaseDate(request.getActualReleaseDate());
    }
    if (request.getStatus() != null && !request.getStatus().isBlank()) {
      version.setStatus(request.getStatus());
    }
    if (request.getDescription() != null) {
      version.setDescription(request.getDescription());
    }
    return versionRepository.save(version);
  }

  public boolean delete(Long id) {
    if (!versionRepository.existsById(id)) {
      return false;
    }
    if (requirementRepository.existsByVersionId(id)) {
      throw new IllegalStateException("VERSION_REFERENCED_BY_REQUIREMENT");
    }
    versionRepository.deleteById(id);
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
