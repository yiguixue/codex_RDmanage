package com.rdmanage.service;

import com.rdmanage.dto.CreateProductModuleRequest;
import com.rdmanage.dto.UpdateProductModuleRequest;
import com.rdmanage.model.Product;
import com.rdmanage.model.ProductModule;
import com.rdmanage.repository.ProductModuleRepository;
import com.rdmanage.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductModuleService {
  private final ProductRepository productRepository;
  private final ProductModuleRepository productModuleRepository;

  public ProductModuleService(
      ProductRepository productRepository, ProductModuleRepository productModuleRepository) {
    this.productRepository = productRepository;
    this.productModuleRepository = productModuleRepository;
  }

  public List<ProductModule> list(Long productId, Long parentId) {
    if (productId == null) {
      return productModuleRepository.findAll();
    }
    if (parentId == null) {
      return productModuleRepository.findByProductId(productId);
    }
    return productModuleRepository.findByProductIdAndParentId(productId, parentId);
  }

  public ProductModule get(Long id) {
    return productModuleRepository.findById(id).orElse(null);
  }

  public ProductModule create(CreateProductModuleRequest request) {
    validateProduct(request.getProductId());
    validateHierarchy(
        request.getProductId(), request.getParentId(), request.getLevel());

    ProductModule module = new ProductModule();
    module.setProductId(request.getProductId());
    module.setParentId(request.getParentId());
    module.setLevel(request.getLevel());
    module.setCode(request.getCode());
    module.setName(request.getName());
    module.setOwner(request.getOwner());
    module.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
    module.setStatus(
        request.getStatus() == null || request.getStatus().isBlank()
            ? "ACTIVE"
            : request.getStatus());
    module.setDescription(request.getDescription());
    return productModuleRepository.save(module);
  }

  public ProductModule update(Long id, UpdateProductModuleRequest request) {
    ProductModule module = productModuleRepository.findById(id).orElse(null);
    if (module == null) {
      return null;
    }
    if (request.getProductId() != null) {
      module.setProductId(request.getProductId());
    }
    if (request.getParentId() != null) {
      module.setParentId(request.getParentId());
    }
    if (request.getLevel() != null) {
      module.setLevel(request.getLevel());
    }
    if (request.getCode() != null) {
      module.setCode(request.getCode());
    }
    if (request.getName() != null) {
      module.setName(request.getName());
    }
    if (request.getOwner() != null) {
      module.setOwner(request.getOwner());
    }
    if (request.getSortOrder() != null) {
      module.setSortOrder(request.getSortOrder());
    }
    if (request.getStatus() != null && !request.getStatus().isBlank()) {
      module.setStatus(request.getStatus());
    }
    if (request.getDescription() != null) {
      module.setDescription(request.getDescription());
    }
    validateProduct(module.getProductId());
    validateHierarchy(module.getProductId(), module.getParentId(), module.getLevel());
    return productModuleRepository.save(module);
  }

  public boolean delete(Long id) {
    if (!productModuleRepository.existsById(id)) {
      return false;
    }
    productModuleRepository.deleteById(id);
    return true;
  }

  private void validateProduct(Long productId) {
    Product product = productRepository.findById(productId).orElse(null);
    if (product == null) {
      throw new IllegalArgumentException("产品不存在");
    }
  }

  private void validateHierarchy(Long productId, Long parentId, Integer level) {
    if (level == null || level < 1 || level > 3) {
      throw new IllegalArgumentException("模块层级必须为1-3");
    }
    if (level == 1) {
      if (parentId != null) {
        throw new IllegalArgumentException("一级模块不允许设置父级");
      }
      return;
    }
    if (parentId == null) {
      throw new IllegalArgumentException("二级/三级模块必须选择父级");
    }
    ProductModule parent = productModuleRepository.findById(parentId).orElse(null);
    if (parent == null) {
      throw new IllegalArgumentException("父级模块不存在");
    }
    if (!parent.getProductId().equals(productId)) {
      throw new IllegalArgumentException("父级模块不属于该产品");
    }
    if (parent.getLevel() != level - 1) {
      throw new IllegalArgumentException("父级模块层级不匹配");
    }
  }
}
