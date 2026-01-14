import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const ExploreItems = ({
  items = [],
  loading = false,
  filter = "",
  onFilterChange = () => {},
}) => {
  const INITIAL_COUNT = 8;
  const LOAD_MORE_STEP = 4;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (ms) => {
    if (!Number.isFinite(ms) || ms <= 0) return "Ended";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [items, filter]);

  const toNumber = (v, fallback = 0) => {
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) ? n : fallback;
  };

  const getPrice = (item) => toNumber(item?.price, 0);
  const getLikes = (item) => toNumber(item?.likes, 0);

  const sortedItems = useMemo(() => {
    const copy = Array.isArray(items) ? [...items] : [];

    if (filter === "price_low_to_high") {
      copy.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (filter === "price_high_to_low") {
      copy.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (filter === "likes_high_to_low") {
      copy.sort((a, b) => getLikes(b) - getLikes(a));
    }

    return copy;
  }, [items, filter]);

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {loading &&
        new Array(INITIAL_COUNT).fill(0).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#e9ecef",
                  }}
                />
              </div>

              <div
                style={{
                  height: 12,
                  width: 80,
                  background: "#e9ecef",
                  borderRadius: 6,
                  margin: "10px 0",
                }}
              />

              <div className="nft__item_wrap">
                <div
                  style={{
                    height: 220,
                    background: "#e9ecef",
                    borderRadius: 10,
                  }}
                />
              </div>

              <div className="nft__item_info">
                <div
                  style={{
                    height: 16,
                    width: 140,
                    background: "#e9ecef",
                    borderRadius: 6,
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    height: 14,
                    width: 90,
                    background: "#e9ecef",
                    borderRadius: 6,
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    height: 14,
                    width: 60,
                    background: "#e9ecef",
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
          </div>
        ))}

      {!loading &&
        sortedItems.slice(0, visibleCount).map((item, index) => {
          const nftId = item?.nftId || item?.id || item?._id || index;

          const authorId =
            item?.authorId || item?.author?.id || item?.author?._id;

          const authorName =
            item?.authorName || item?.author?.name || item?.author || "Author";

          const authorAvatar =
            item?.authorImage ||
            item?.author?.avatar ||
            item?.author?.image ||
            AuthorImage;

          const image =
            item?.image || item?.nftImage || item?.previewImage || nftImage;

          const title = item?.title || item?.name || "Untitled";

          const priceText = item?.price != null ? `${item.price} ETH` : "—";

          const likesText = item?.likes != null ? item.likes : 0;

          const endTimeRaw =
            item?.expiryDate ||
            item?.expiresAt ||
            item?.endDate ||
            item?.auctionEndsAt ||
            item?.timeEnd ||
            item?.countdownEnd;

          const endTimeMs = endTimeRaw ? new Date(endTimeRaw).getTime() : null;

          const countdownText = endTimeMs
            ? formatCountdown(endTimeMs - now)
            : "—";

          return (
            <div
              key={nftId}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to={`/author/${authorId}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={authorName}
                  >
                    <img
                      className="lazy"
                      src={authorAvatar}
                      alt={authorName}
                      onError={(e) => {
                        e.currentTarget.src = AuthorImage;
                      }}
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>

                {countdownText !== "—" && (
                  <div className="de_countdown">{countdownText}</div>
                )}

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <Link to={`/item-details/${nftId}`}>
                    <img
                      src={image}
                      className="lazy nft__item_preview"
                      alt={title}
                      onError={(e) => {
                        e.currentTarget.src = nftImage;
                      }}
                    />
                  </Link>
                </div>

                <div className="nft__item_info">
                  <Link to={`/item-details/${nftId}`}>
                    <h4>{title}</h4>
                  </Link>

                  <div className="nft__item_price">{priceText}</div>

                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{likesText}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {!loading && (
        <div className="col-md-12 text-center">
          <button
            type="button"
            id="loadmore"
            className="btn-main lead"
            disabled={visibleCount >= sortedItems.length}
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            style={{
              cursor:
                visibleCount >= sortedItems.length ? "not-allowed" : "pointer",
            }}
          >
            {visibleCount >= sortedItems.length ? "No more items" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
