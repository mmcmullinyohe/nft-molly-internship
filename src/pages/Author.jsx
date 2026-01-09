import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorImage from "../images/author_thumbnail.jpg";
import AuthorItems from "../components/author/AuthorItems";
import "./Author.css";

const BASE_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";

const Author = () => {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

  const apiUrl = useMemo(() => {
    const id = encodeURIComponent(authorId || "");
    return `${BASE_URL}?author=${id}`;
  }, [authorId]);

  useEffect(() => {
    if (!authorId) return;

    const controller = new AbortController();

    const fetchAuthor = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        setAuthor(null);

        const res = await axios.get(apiUrl, { signal: controller.signal });

        const payload = res?.data;
        const data = Array.isArray(payload)
          ? payload[0]
          : Array.isArray(payload?.data)
          ? payload.data[0]
          : payload?.data ?? payload;

        setAuthor(data || null);

        const initialFollowers =
          Number(
            data?.followers ?? data?.followerCount ?? data?.followersCount
          ) || 0;

        setFollowers(initialFollowers);
        setIsFollowing(Boolean(data?.isFollowing ?? data?.followed ?? false));
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load author."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
    return () => controller.abort();
  }, [apiUrl, authorId]);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
    setFollowers((f) => (isFollowing ? Math.max(0, f - 1) : f + 1));
  };

  const display = useMemo(() => {
    const name =
      author?.authorName || author?.name || author?.username || "Author";
    const username =
      author?.tag ||
      author?.username ||
      author?.handle ||
      author?.authorUsername ||
      "";
    const wallet =
      author?.wallet ||
      author?.walletAddress ||
      author?.address ||
      author?.wallet_id ||
      "";
    const avatar =
      author?.authorImage ||
      author?.avatar ||
      author?.profileImage ||
      author?.image ||
      AuthorImage;

    const verified = Boolean(author?.tag);

    return { name, username, wallet, avatar, verified };
  }, [author]);

  if (!authorId) {
    return <div style={{ padding: 20 }}>Missing author id.</div>;
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section
          id="profile_banner"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        />
        <section>
          <div className="container">
            {!loading && !errorMsg && author && (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div className="avatar_wrap">
                          <img
                            src={display.avatar}
                            alt={display.name}
                            onError={(e) => {
                              e.currentTarget.src = AuthorImage;
                            }}
                          />
                          {display.verified && (
                            <span className="verified_badge">✓</span>
                          )}
                        </div>

                        <div className="profile_name">
                          <h4 className="author_name">{display.name}</h4>
                          {display.username && (
                            <div className="author_username">
                              @{display.username}
                            </div>
                          )}
                          {display.wallet && (
                            <div className="author_wallet_row">
                              <span className="author_wallet">
                                {display.wallet}
                              </span>
                              <button
                                type="button"
                                className="btn-wallet"
                                style={{
                                  pointerEvents: "auto",
                                  position: "relative",
                                  zIndex: 9999,
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(display.wallet);
                                }}
                              >
                                Copy
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {followers} followers
                        </div>
                        <button
                          type="button"
                          className="btn-main"
                          onClick={handleToggleFollow}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <AuthorItems authorId={authorId} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
