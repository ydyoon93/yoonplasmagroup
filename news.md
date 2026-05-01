---
title: News
permalink: /news/
---

<ul class="news-list news-archive">
{% assign sorted_news = site.news | sort: "date" | reverse %}
{% for item in sorted_news %}
  <li class="news-item">
    <span class="news-date">{{ item.date | date: "%b %-d, %Y" }}</span>
    <span class="news-sep">·</span>
    {% if item.link %}
      <a href="{{ item.link | relative_url }}">{{ item.title }}</a>
    {% else %}
      <span>{{ item.title }}</span>
    {% endif %}
    {% if item.content and item.content != "" %}
      <div class="news-body">{{ item.content | markdownify }}</div>
    {% endif %}
  </li>
{% endfor %}
</ul>
