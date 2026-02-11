package com.rdmanage.controller;

import com.rdmanage.dto.DictItemRequest;
import com.rdmanage.model.DictItem;
import com.rdmanage.service.DictService;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/dicts")
public class DictController {
  private final DictService dictService;

  public DictController(DictService dictService) {
    this.dictService = dictService;
  }

  @GetMapping
  public List<DictItem> listAll() {
    return dictService.listAll();
  }

  @PostMapping
  public DictItem create(@RequestBody DictItemRequest request) {
    return dictService.create(request);
  }

  @PutMapping("/{id}")
  public DictItem update(@PathVariable Long id, @RequestBody DictItemRequest request) {
    return dictService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    dictService.delete(id);
  }
}
