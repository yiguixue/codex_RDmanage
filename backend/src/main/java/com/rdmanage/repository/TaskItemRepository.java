package com.rdmanage.repository;

import com.rdmanage.model.TaskItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskItemRepository extends JpaRepository<TaskItem, Long> {
  List<TaskItem> findByProductId(Long productId);
  List<TaskItem> findByProductIdAndModuleId(Long productId, Long moduleId);
}
