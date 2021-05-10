/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { getArticleByUser } from "../serverCommunication";
import { Link } from "react-router-dom";

export default function Dashboard(props) {
  const [firstname, setFirstname] = useState(props.firstname);
  const [lastname, setLastname] = useState(props.lastname);
  const [articles, setArticles] = useState(props.articles);

  useEffect(() => {
    handleGetArticles();
  }, []);

  useEffect(() => {
    setFirstname(props.firstname);
    setLastname(props.lastname);
  }, [props.firstname][props.lastname]);

  function handleGetArticles() {
    getArticleByUser()
      .then((result) => result.json())
      .then((result) => {
        setArticles(result.articles);
      });
  }

  return (
    <div className="readArticle">
      <h2 class="center">
        All saved articles of {firstname} {lastname}
      </h2>
      <div class="row">
        {articles.map((data) => {
          return (
            <div key={data._id}>
              <div class="card blue-grey darken-1 dashboard-article">
                <div class="card-image">
                  <img src={data.lead_image_url} />
                  <div class="col">
                    <span class="card-title">{data.title}</span>
                  </div>
                </div>
                <div class="card-content">
                  <p>{data.excerpt}</p>
                  <span class="author">Author: {data.author}</span>
                  <span class="source">Source: {data.domain}</span>
                  <br />
                  <span>
                    Tags:{" "}
                    {data.tags.map((element, i) => {
                      return <li key={i}>{element + " "}</li>;
                    })}
                  </span>
                  <div class="row">
                    <br />
                    <div class="col">
                      <Link to={`/article/${data._id}`}>
                        <a id="seeArticle" class="btn green">
                          Read article
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
