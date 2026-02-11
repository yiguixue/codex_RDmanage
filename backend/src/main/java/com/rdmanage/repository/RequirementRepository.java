package com.rdmanage.repository;

import com.rdmanage.model.Requirement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequirementRepository extends JpaRepository<Requirement, Long> {
  List<Requirement> findByProductId(Long productId);
  List<Requirement> findByProductIdAndModuleId(Long productId, Long moduleId);
  boolean existsByVersionId(Long versionId);
}
