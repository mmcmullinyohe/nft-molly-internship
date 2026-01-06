import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchTopSellers = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await axios.get(API_URL, {
          signal: controller.signal,
        });

        const payload = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.data || payload?.topSellers || [];

        setSellers(Array.isArray(list) ? list : []);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;

        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load top sellers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();

    return () => controller.abort();
  }, []);

  const formatEth = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    return `${num.toFixed(1)} ETH`;
  };

  const normalized = sellers.slice(0, 12).map((s, index) => {
    const name = s?.authorName || s?.name || s?.username || "Unknown Seller";
    const avatar =
      s?.authorImage || s?.avatar || s?.profileImage || s?.image || AuthorImage;

    const eth =
      formatEth(s?.sales) ||
      formatEth(s?.totalSales) ||
      formatEth(s?.amount) ||
      formatEth(s?.price) ||
      null;

    const verified = Boolean(s?.verified ?? s?.isVerified);

    const authorId = s?.authorId || s?.id || s?._id;
    const to = authorId ? `/author/${authorId}` : "/author";

    return {
      key: authorId || `${name}-${index}`,
      to,
      name,
      avatar,
      eth: eth || "—",
      verified,
    };
  });

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>

              {}
              {loading && (
                <div style={{ marginTop: 10, fontSize: 14, opacity: 0.8 }}>
                  Loading top sellers…
                </div>
              )}
              {!loading && errorMsg && (
                <div style={{ marginTop: 10, fontSize: 14, color: "crimson" }}>
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-12">
            <ol className="author_list">
              {}
              {loading && normalized.length === 0
                ? new Array(12).fill(0).map((_, i) => (
                    <li key={`placeholder-${i}`}>
                      <div className="author_list_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-author"
                            src={AuthorImage}
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to="/author">Loading…</Link>
                        <span>—</span>
                      </div>
                    </li>
                  ))
                : normalized.map((seller) => (
                    <li key={seller.key}>
                      <div className="author_list_pp">
                        <Link to={seller.to}>
                          <img
                            className="lazy pp-author"
                            src={seller.avatar}
                            alt={seller.name}
                            onError={(e) => {
                              e.currentTarget.src = AuthorImage;
                            }}
                          />
                          {seller.verified && <i className="fa fa-check"></i>}
                        </Link>
                      </div>

                      <div className="author_list_info">
                        <Link to={seller.to}>{seller.name}</Link>
                        <span>{seller.eth}</span>
                      </div>
                    </li>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
