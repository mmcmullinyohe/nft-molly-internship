import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const BASE_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";

const AuthorItems = ({ authorId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const apiUrl = useMemo(() => {
    const id = encodeURIComponent(authorId || "");
    return `${BASE_URL}?author=${id}`;
  }, [authorId]);

  useEffect(() => {
    if (!authorId) return;

    const controller = new AbortController();

    const fetchAuthorItems = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        setItems([]);

        const res = await axios.get(apiUrl, { signal: controller.signal });

        const payload = res?.data;
        const authorData = Array.isArray(payload)
          ? payload[0]
          : Array.isArray(payload?.data)
          ? payload.data[0]
          : payload?.data ?? payload;

        const extracted =
          authorData?.nftCollection ||
          authorData?.items ||
          authorData?.nfts ||
          authorData?.authorItems ||
          authorData?.created ||
          authorData?.collections ||
          [];

        setItems(Array.isArray(extracted) ? extracted : []);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;

        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load author items."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorItems();
    return () => controller.abort();
  }, [apiUrl, authorId]);

  const getItemId = (it) =>
    it?.nftId || it?.id || it?._id || it?.itemId || it?.tokenId || "";

  const getTitle = (it) =>
    it?.title || it?.name || it?.nftName || it?.itemName || "Untitled";

  const getPrice = (it) => {
    const raw = it?.price ?? it?.currentPrice ?? it?.ethPrice ?? it?.amount;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const getLikes = (it) =>
    Number(it?.likes ?? it?.likeCount ?? it?.favorites ?? 0) || 0;

  const getPreview = (it) =>
    it?.nftImage || it?.image || it?.previewImage || it?.coverImage || nftImage;

  const getAvatar = (it) =>
    it?.authorImage || it?.creatorImage || it?.avatar || AuthorImage;

  if (loading) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            {new Array(8).fill(0).map((_, i) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={i}>
                <div
                  style={{
                    height: 220,
                    background: "#e9ecef",
                    borderRadius: 14,
                    marginBottom: 20,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="de_tab_content">
        <div style={{ padding: "10px 0", color: "crimson" }}>{errorMsg}</div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="de_tab_content">
        <div style={{ padding: "10px 0", opacity: 0.8 }}>
          No items found for this author.
        </div>
      </div>
    );
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.map((it, index) => {
            const id = getItemId(it) || `fallback-${index}`;
            const title = getTitle(it);
            const price = getPrice(it);
            const likes = getLikes(it);
            const preview = getPreview(it);
            const avatar = getAvatar(it);

            return (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={id}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to={`/author/${authorId}`}>
                      <img
                        className="lazy"
                        src={avatar}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = AuthorImage;
                        }}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  <div className="nft__item_wrap">
                    {}
                    <Link to={`/item-details/${getItemId(it)}`}>
                      <img
                        src={preview}
                        className="lazy nft__item_preview"
                        alt={title}
                        onError={(e) => {
                          e.currentTarget.src = nftImage;
                        }}
                      />
                    </Link>
                  </div>

                  <div className="nft__item_info">
                    <Link to={`/item-details/${getItemId(it)}`}>
                      <h4>{title}</h4>
                    </Link>

                    <div className="nft__item_price">
                      {price !== null ? `${price} ETH` : "—"}
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
      </div>
    </div>
  );
};

export default AuthorItems;
