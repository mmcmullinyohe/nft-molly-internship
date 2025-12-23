import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchHotCollections = async () => {
      try {
        setLoading(true);
        setErr("");

        const { data } = await axios.get(API_URL);

        setCollections(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr("Could not load hot collections.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading && (
            <div className="col-12 text-center">
              <p>Loading collections…</p>
            </div>
          )}

          {!loading && err && (
            <div className="col-12 text-center">
              <p>{err}</p>
            </div>
          )}

          {!loading &&
            !err &&
            collections.map((item, index) => {

              const key = item.nftId ?? item.id ?? index;

   
              const title = item.title ?? item.name ?? "Untitled Collection";
              const code = item.code ?? item.blockchain ?? item.chain ?? "—";

              const imageSrc =
                item.nftImage ?? item.image ?? item.cover ?? item.banner ?? nftImage;

              const authorSrc =
                item.authorImage ?? item.creatorImage ?? item.profileImage ?? AuthorImage;

              return (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={key}>
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to={`/item-details/${item.nftId}`}>
                        <img
                          src={imageSrc}
                          className="lazy img-fluid"
                          alt={title}
                        />
                      </Link>
                    </div>

                    <div className="nft_coll_pp">
                      <Link to="/author">
                        <img
                          className="lazy pp-coll"
                          src={authorSrc}
                          alt="author"
                        />
                      </Link>
                      <i className="fa fa-check"></i>
                    </div>

                    <div className="nft_coll_info">
                      <Link to="/explore">
                        <h4>{title}</h4>
                      </Link>
                      <span>{code}</span>
                    </div>
                  </div>
                </div>
              );
            })}

          {!loading && !err && collections.length === 0 && (
            <div className="col-12 text-center">
              <p>No collections found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
