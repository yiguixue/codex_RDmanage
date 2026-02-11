package com.rdmanage.service;

import com.rdmanage.dto.CreateProductRequest;
import com.rdmanage.dto.UpdateProductRequest;
import com.rdmanage.model.Product;
import com.rdmanage.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public List<Product> list() {
    return productRepository.findAll();
  }

  public Product get(Long id) {
    return productRepository.findById(id).orElse(null);
  }

  public Product create(CreateProductRequest request) {
    Product product = new Product();
    product.setCode(request.getCode());
    product.setName(request.getName());
    product.setOwner(request.getOwner());
    product.setStatus(
        request.getStatus() == null || request.getStatus().isBlank()
            ? "ACTIVE"
            : request.getStatus());
    product.setDescription(request.getDescription());
    return productRepository.save(product);
  }

  public Product update(Long id, UpdateProductRequest request) {
    Product product = productRepository.findById(id).orElse(null);
    if (product == null) {
      return null;
    }
    if (request.getName() != null) {
      product.setName(request.getName());
    }
    if (request.getOwner() != null) {
      product.setOwner(request.getOwner());
    }
    if (request.getStatus() != null && !request.getStatus().isBlank()) {
      product.setStatus(request.getStatus());
    }
    if (request.getDescription() != null) {
      product.setDescription(request.getDescription());
    }
    return productRepository.save(product);
  }

  public boolean delete(Long id) {
    if (!productRepository.existsById(id)) {
      return false;
    }
    productRepository.deleteById(id);
    return true;
  }
}
