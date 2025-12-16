import { Link } from "react-router-dom";
import "./HomePage.css";
import pho from "./pho.jpg";
import com from "./com.png";

export default function HomePage() {
  return (
    <>
      <div
        className="py-5"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #cff8eeff, #e7de9eff)",
        }}
      >
        <div className="container-fluid px-5">
          <div className="row align-items-center gy-5">
            {/* Left content */}
            <div className="col-lg-6">
              <h1 className="fw-bold display-5">
                Từ gian bếp nhỏ
                <br />
                Đến <span className="text-warning">hàng ngàn</span> bữa ăn ngon
              </h1>

              <p className="text-muted mt-3">
                Khám phá các công thức món ăn cho lần vào bếp tiếp theo của bạn!
              </p>
              <Link
                to="/recipes"
                className="btn btn-warning rounded-pill px-4 py-2 fw-semibold mt-3"
              >
                XEM CÔNG THỨC →
              </Link>
            </div>

            {/* Right: rotating images */}
            <div className="col-lg-6 text-center">
              <div className="rotating-image-container">
                <img src={com} alt="Com" className="rotating-image" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="row text-center mt-5 pt-5">
            <div className="col-md-4">
              <h2 className="fw-bold">500+</h2>
              <p className="text-uppercase text-muted small">Công thức</p>
              <p className="text-muted small">
                Công thức nấu ăn được chia sẻ và cập nhật mỗi ngày.
              </p>
            </div>

            <div className="col-md-4">
              <h2 className="fw-bold">1K+</h2>
              <p className="text-uppercase text-muted small">Bài đăng</p>
              <p className="text-muted small">
                Bài đăng từ cộng đồng yêu bếp và đam mê sáng tạo.
              </p>
            </div>

            <div className="col-md-4">
              <h2 className="fw-bold">300+</h2>
              <p className="text-uppercase text-muted small">Thành viên</p>
              <p className="text-muted small">
                Kết nối những người yêu nấu ăn trên khắp mọi nơi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission section (white background) */}
      <div
        className="mission-section py-5"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="container px-5">
          <div className="row align-items-center">
            {/* Left: mission text */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-3">Sứ Mệnh CukkLuv</h2>
              <p className="text-muted">
                Tại <span className="text-warning fw-bold">CukkLuv</span>, chúng tôi tin rằng ẩm thực là cầu nối tuyệt vời
                nhất. Sứ mệnh cốt lõi của chúng tôi là khơi nguồn cảm hứng và
                kết nối cộng đồng yêu bếp từ khắp mọi miền. Chúng tôi tạo ra một
                không gian số sôi nổi, nơi mọi người, từ đầu bếp chuyên nghiệp
                đến người mới bắt đầu, đều có thể tìm thấy niềm vui và sự ủng hộ
                trong hành trình ẩm thực của mình.
              </p>
              <p className="text-muted">
                <span className="text-warning fw-bold">CukkLuv</span> cam kết trở thành kho tàng lưu giữ và phát huy tinh hoa
                ẩm thực. Chúng tôi mong muốn mang những công thức truyền thống,
                những món ăn gia đình ấm cúng của Việt Nam, cùng với các sáng
                tạo ẩm thực hiện đại, đến gần hơn với mọi nhà. Mục tiêu là để
                mỗi bữa ăn không chỉ là việc lấp đầy dạ dày mà còn là cách để
                tôn vinh và tiếp nối văn hóa bếp Việt.
              </p>
            </div>

             {/* Right image */}
            <div className="col-lg-6 text-center position-relative">
              <div
                className="overflow-hidden shadow mx-auto"
                style={{ width: 400, height: 470, borderRadius: '5rem'}}
              >
                <img
                  src={pho}
                  alt="Food"
                  className="img-fluid w-100 h-100 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
