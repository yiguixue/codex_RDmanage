package com.rdmanage.service;

import com.rdmanage.dto.DictItemRequest;
import com.rdmanage.model.DictItem;
import com.rdmanage.repository.DictItemRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DictService {
  private final DictItemRepository dictItemRepository;

  public DictService(DictItemRepository dictItemRepository) {
    this.dictItemRepository = dictItemRepository;
  }

  public List<DictItem> listAll() {
    return dictItemRepository.findAll();
  }

  public DictItem create(DictItemRequest request) {
    DictItem item = new DictItem();
    applyRequest(item, request);
    return dictItemRepository.save(item);
  }

  public DictItem update(Long id, DictItemRequest request) {
    DictItem item = dictItemRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "字典不存在"));
    applyRequest(item, request);
    return dictItemRepository.save(item);
  }

  public void delete(Long id) {
    if (!dictItemRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "字典不存在");
    }
    dictItemRepository.deleteById(id);
  }

  private void applyRequest(DictItem item, DictItemRequest request) {
    item.setDictType(request.getDictType());
    item.setDictCode(request.getDictCode());
    item.setDictLabel(request.getDictLabel());
    item.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
    item.setIsActive(request.getIsActive() != null ? request.getIsActive() : 1);
    item.setRemark(request.getRemark());
  }
}
