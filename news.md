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
    {% assign link = item.link | strip %}
    {% if link != "" %}
      <a href="{{ link | relative_url }}">{{ item.title }}</a>
    {% else %}
      <span>{{ item.title }}</span>
    {% endif %}
    {% assign desc = item.description | strip %}
    {% if desc != "" %}
      <div class="news-body">{{ desc | markdownify }}</div>
    {% endif %}
  </li>
{% endfor %}
</ul>
