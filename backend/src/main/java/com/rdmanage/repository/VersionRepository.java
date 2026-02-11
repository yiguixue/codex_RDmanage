package com.rdmanage.repository;

import com.rdmanage.model.VersionInfo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VersionRepository extends JpaRepository<VersionInfo, Long> {
  List<VersionInfo> findByProductId(Long productId);
  List<VersionInfo> findByProductIdAndModuleId(Long productId, Long moduleId);
}
