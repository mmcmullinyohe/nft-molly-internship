import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

function pickImage(item) {
  return (
    item?.nftImage ||
    item?.image ||
    item?.cover ||
    item?.banner ||
    item?.img ||
    item?.imageUrl ||
    item?.nftImageUrl ||
    nftImage
  );
}

function pickAuthorImage(item) {
  return (
    item?.authorImage ||
    item?.creatorImage ||
    item?.profileImage ||
    item?.author?.image ||
    item?.creator?.image ||
    AuthorImage
  );
}

function pickEndTime(item) {
  const raw =
    item?.expiresAt ||
    item?.endTime ||
    item?.endingAt ||
    item?.auctionEndsAt ||
    item?.expiryDate ||
    item?.deadline;

  if (!raw) return null;
  if (typeof raw === "number") {
    return new Date(raw < 10_000_000_000 ? raw * 1000 : raw);
  }

  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function formatCountdown(msRemaining) {
  if (msRemaining <= 0) return "Ended";

  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: { perView: 4, spacing: 16 },
      breakpoints: {
        "(max-width: 1200px)": { slides: { perView: 3, spacing: 16 } },
        "(max-width: 992px)": { slides: { perView: 2, spacing: 14 } },
        "(max-width: 576px)": { slides: { perView: 1, spacing: 12 } },
      },
    },
    []
  );

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await axios.get(API_URL);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr("Could not load new items.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewItems();
  }, []);

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.update();
  }, [items, instanceRef]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const isReady = !loading && !err && items.length > 0;

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading && (
            <div className="col-12 text-center">
              <p>Loading new items…</p>
            </div>
          )}

          {!loading && err && (
            <div className="col-12 text-center">
              <p>{err}</p>
            </div>
          )}

          {isReady && (
            <div className="col-12">
              <div className="new-items-carousel">
                <button
                  type="button"
                  className="hc-arrow hc-arrow--left"
                  onClick={() => instanceRef.current?.prev()}
                >
                  ‹
                </button>

                <div ref={sliderRef} className="keen-slider">
                  {items.map((item, index) => {
                    const nftId = item?.nftId ?? item?.id ?? String(index);

                    const authorId =
                      item?.authorId ??
                      item?.creatorId ??
                      item?.author?.authorId ??
                      item?.creator?.authorId ??
                      item?.author?.id ??
                      item?.creator?.id ??
                      item?.author?.address ??
                      item?.creator?.address ??
                      "";

                    const title = item?.title ?? item?.name ?? "New Item";
                    const imageSrc = pickImage(item);
                    const authorSrc = pickAuthorImage(item);
                    const creatorName =
                      item?.creatorName ||
                      item?.authorName ||
                      item?.creator?.name ||
                      item?.author?.name ||
                      "Creator";

                    const price =
                      item?.price ??
                      item?.ethPrice ??
                      item?.amount ??
                      item?.bid ??
                      "—";

                    const likes = item?.likes ?? item?.likeCount ?? 0;

                    const endTime = pickEndTime(item);
                    const remaining = endTime
                      ? endTime.getTime() - Date.now()
                      : null;
                    const countdownText =
                      remaining === null ? "" : formatCountdown(remaining);

                    return (
                      <div className="keen-slider__slide" key={nftId}>
                        <div className="nft__item">
                          <div className="author_list_pp">
                            <Link
                              to={authorId ? `/author/${authorId}` : "/author"}
                              title={`Creator: ${creatorName}`}
                            >
                              <img src={authorSrc} alt={creatorName} />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>

                          {countdownText && (
                            <div className="de_countdown">
                              {countdownText}
                            </div>
                          )}

                          <div className="nft__item_wrap">
                            <Link to={`/item-details/${nftId}`}>
                              <img
                                src={imageSrc}
                                className="lazy nft__item_preview"
                                alt={title}
                              />
                            </Link>
                          </div>

                          <div className="nft__item_info">
                            <Link to={`/item-details/${nftId}`}>
                              <h4>{title}</h4>
                            </Link>

                            <div className="nft__item_price">
                              {price}{" "}
                              {String(price).includes("ETH") ? "" : "ETH"}
                            </div>

                            <div className="nft__item_like">
                              <i className="fa fa-heart"></i>
                              <span>{likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="hc-arrow hc-arrow--right"
                  onClick={() => instanceRef.current?.next()}
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {!loading && !err && items.length === 0 && (
            <div className="col-12 text-center">
              <p>No new items found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
