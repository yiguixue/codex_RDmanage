package com.rdmanage.repository;

import com.rdmanage.model.ProductModule;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductModuleRepository extends JpaRepository<ProductModule, Long> {
  List<ProductModule> findByProductId(Long productId);
  List<ProductModule> findByProductIdAndParentId(Long productId, Long parentId);
}
