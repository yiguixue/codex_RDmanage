package com.rdmanage.repository;

import com.rdmanage.model.DictItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictItemRepository extends JpaRepository<DictItem, Long> {}
