import React from "react";
import { Save, Upload, Plus, Trash2 } from "lucide-react";

export default function CreateRecipeModal() {
  return (
    <div className="modal fade" id="createRecipeModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-warning">Tạo công thức mới</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body p-4">
            <div className="position-relative mb-4 text-center border rounded bg-light" style={{ minHeight: "200px" }}>
              <div className="py-5 text-muted">
                <Upload size={40} className="mb-2 opacity-50" />
                <div>Chưa có ảnh chính</div>
              </div>
              
              <label className="btn btn-sm btn-warning position-absolute bottom-0 end-0 m-2 shadow text-white">
                <Upload size={18} className="me-1" /> Thêm ảnh chính
                <input type="file" className="d-none" accept="image/*" />
              </label>
            </div>

            {/* 2. Thông tin cơ bản */}
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-bold">Tên món ăn</label>
                <input className="form-control" placeholder="Ví dụ: Phở Bò" />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Thời gian (phút)</label>
                <input type="number" className="form-control" placeholder="0" />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Khẩu phần (người)</label>
                <input type="number" className="form-control" placeholder="1" />
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Mô tả ngắn</label>
                <textarea className="form-control" rows={2} placeholder="Chia sẻ một chút về món ăn này..." />
              </div>

              <div className="col-12">
                <h5 className="text-warning fw-bold mt-3">Nguyên liệu</h5>
                <textarea className="form-control" rows={4} placeholder="1kg thịt bò, 500g bánh phở..." />
              </div>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-warning fw-bold mb-0">Các bước thực hiện</h5>
              <button type="button" className="btn btn-sm btn-outline-success">
                <Plus size={18} className="me-1" /> Thêm bước
              </button>
            </div>


            <div className="border p-3 mb-3 rounded bg-light shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-warning text-white">Bước 1</span>
                <button className="btn btn-sm text-danger p-0">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <textarea 
                className="form-control mb-3" 
                placeholder="Mô tả cách làm bước này..." 
              />
              
              <div className="d-flex gap-2 flex-wrap align-items-center">
                <label className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                       style={{width: '70px', height: '70px', borderStyle: 'dashed'}}>
                   <div className="text-center">
                     <Upload size={16} />
                     <div style={{fontSize: '9px'}}>Ảnh</div>
                   </div>
                   <input type="file" className="d-none" accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button className="btn btn-warning text-white px-4">
              <Save size={20} className="me-1" /> Đăng công thức
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}