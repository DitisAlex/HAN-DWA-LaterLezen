const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConfig = require("../config/passport");
const JWT = require("jsonwebtoken");
const Mercury = require("@postlight/mercury-parser");
const ObjectID = require("mongodb").ObjectID;
const { extract } = require("article-parser");
const User = require("../models/User");
const Article = require("../models/Article");

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "Laterlezen",
      sub: userID,
    },
    "LaterLezen",
    {
      expiresIn: "1h",
    }
  );
};

router.post("/register", (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  let minPasswordLength = 7;

  if (emailFormat.test(email)) {
    if (password.length > minPasswordLength) {
      User.findOne(
        {
          email,
        },
        (err, user) => {
          if (err)
            res.status(500).json({
              message: {
                msgBody: "Error has occured",
                msgError: true,
              },
            });
          if (user)
            res.status(400).json({
              message: {
                msgBody: "Username already taken",
                msgError: true,
              },
            });
          else {
            const newUser = new User({
              email,
              password,
              firstname,
              lastname,
            });
            let defaultTag = {
              tagName: "/",
              subTags: [],
            };
            newUser.tags = defaultTag;
            newUser.save((err) => {
              if (err)
                res.status(500).json({
                  message: {
                    msgBody: "Error has occured",
                    msgError: true,
                  },
                });
              else
                res.status(200).json({
                  message: {
                    msgBody: "Account sucessfully created",
                    msgError: false,
                  },
                });
            });
          }
        }
      );
    } else {
      res.status(500).json({
        message: {
          msgBody: "Password must be 7 characters or longer.",
          msgError: true,
        },
      });
    }
  } else {
    res.status(500).json({
      message: {
        msgBody: "Wrong email format.",
        msgError: true,
      },
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    session: false,
  }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, email, firstname, lastname } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).json({
        isAuthenticated: true,
        email,
        firstname,
        lastname,
        tags: req.user.tags,
        _id,
      });
    }
  }
);

router.get(
  "/logout",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({
      user: {
        email: "",
      },
      succes: true,
    });
  }
);

router.get("/article/:id", (req, res) => {
  const id = req.params.id;
  Article.findOne({ _id: id }, (err, article) => {
    if (!article)
      res.status(400).json({
        error: true,
      });
    else {
      res.send(article);
    }
  });
});

router.post(
  "/article",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    let url = String(req.body.url);
    let rawTags = req.body.tags;
    let usedids;
    let description;
    extract(url)
      .then((article) => {
        description = article.description;
      })
      .catch((err) => {});
    Mercury.parse(url)
      .then((response) => {
        let newArticle = new Article(response);
        if (!req.body.title == "") newArticle.title = req.body.title;
        if (description != null) newArticle.excerpt = description;
        if (
          response.lead_image_url == "" ||
          response.lead_image_url == null ||
          response.lead_image_url == undefined
        )
          newArticle.lead_image_url = "./placeholder_1210x681.png";
        newArticle.tags = rawTags;
        usedids = handleUserNestedTags(rawTags, req.user.tags);
        newArticle.tagids = usedids;
        req.user.articles.push(newArticle);
        req.user.markModified("tags");
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: {
                msgBody: "Error has occured",
                msgError: true,
              },
            });
          else {
            newArticle.save((err) => {
              if (err)
                res.status(500).json({
                  message: {
                    msgBody: "Error has occured",
                    msgError: true,
                  },
                });
            });
            res.json(req.user);
          }
        });
      })
      .catch((err) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
      });
  }
);

router.get(
  "/articles",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    User.findById({
      _id: req.user._id,
    })
      .populate("articles")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        else {
          res.status(200).json({
            articles: document.articles,
            authenticated: true,
          });
        }
      });
  }
);

router.put(
  "/article",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    let usedids;
    Article.findOne(
      {
        _id: req.body.article_id,
      },
      (err, article) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        else {
          article.title = req.body.title;
          article.author = req.body.author;
          article.excerpt = req.body.description;
          article.domain = req.body.source;
          if (!req.body.tags[0] == "") {
            article.tags = req.body.tags;
            usedids = handleUserNestedTags(req.body.tags, req.user.tags);
            article.tagids = usedids;
            req.user.markModified("tags");
            req.user.save();
          }
          article.save();
          res.json(article);
        }
      }
    );
  }
);

router.get(
  "/authenticated",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    const { firstname, lastname, email, tags } = req.user;
    res.status(200).json({
      isAuthenticated: true,
      user: {
        email,
        firstname,
        lastname,
        tags,
      },
    });
  }
);

router.put(
  "/preference",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    if (
      req.body.theme === "default" ||
      req.body.theme === "typewriter" ||
      req.body.theme === "dark" ||
      req.body.theme === "bluegrey" ||
      req.body.theme === "darkblue"
    ) {
      await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          preferences: req.body.theme,
        }
      )
        .then(
          res.status(200).json({
            message: {
              msgBody: "succes",
              msgError: false,
            },
          })
        )
        .catch(() => {
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        });
    } else {
      res.status(500).json({
        message: {
          msgBody: "Error has occured",
          msgError: true,
        },
      });
    }
  }
);

router.get(
  "/preference",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    var query = await User.findOne({
      _id: req.user._id,
    }).select("preferences");
    res.send(JSON.stringify(query.preferences));
  }
);

router.put(
  "/search",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    let query = req.body.query;
    let searchContent = req.body.searchContent;

    let searchFields = {};

    if (query) {
      searchFields = {
        $or: [
          { title: { $regex: new RegExp(query, "i") } },
          { excerpt: { $regex: new RegExp(query, "i") } },
          { author: { $regex: new RegExp(query, "i") } },
          { domain: { $regex: new RegExp(query, "i") } },
        ],
      };

      if (searchContent) {
        searchFields.$or.push({ content: { $regex: new RegExp(query, "i") } });
      }
    }

    User.findById({
      _id: req.user._id,
    })
      .populate({
        path: "articles",
        match: searchFields,
      })
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        else {
          res.send(document.articles);
        }
      });
  }
);

router.put(
  "/tags",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    let tags = req.body.tagids;
    User.findById({
      _id: req.user._id,
    })
      .populate({
        path: "articles",
        match: {
          tagids: {
            $all: tags,
          },
        },
      })
      .exec((err, document) => {
        if (err) {
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        } else {
          res.status(200).json({
            articles: document.articles,
            authenticated: true,
          });
        }
      });
  }
);

router.get(
  "/sources/",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    User.findById({
      _id: req.user._id,
    })
      .populate("articles", "domain")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        else {
          res.send(document.articles);
        }
      });
  }
);

router.get(
  "/authors/",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    User.findById({
      _id: req.user._id,
    })
      .populate("articles", "author")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        else {
          res.send(document.articles);
        }
      });
  }
);

function handleUserNestedTags(data, userTags) {
  let usedids = [];

  const node = (tagName, parent = null, index) => ({
    tagName,
    parent,
    index,
    _id: new ObjectID(),
    subTags: [],
  });
  const addNode = (parent, child) => (parent.subTags.push(child), child);
  const findNamed = (name, parent) => {
    for (const child of parent.subTags) {
      if (child.tagName === name) {
        return child;
      }
      const found = findNamed(name, child);
      if (found) {
        return found;
      }
    }
  };
  const TOP_NAME = "/",
    top = node(TOP_NAME);
  for (const children of data) {
    let parent = userTags;
    let index = 0;
    for (const name of children) {
      index = index + 1;
      const found = findNamed(name, parent);
      parent = found
        ? found
        : addNode(parent, node(name, parent.tagName, index));
      usedids.push(parent._id.toString());
    }
  }
  return usedids;
}

router.put(
  "/tags",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    let tags = req.body.tags;

    User.findById({
      _id: req.user._id,
    })
      .populate({
        path: "articles",
        match: {
          "tags": tags
        },
      })
      .exec((err, document) => {
        if (err) {
          res.status(500).json({
            message: {
              msgBody: "Error has occured",
              msgError: true,
            },
          });
        }
        else {
          res.status(200).json({
            articles: document.articles,
            authenticated: true,
          });
        }
      });
  }
);

module.exports = router;
