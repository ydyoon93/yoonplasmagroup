---
title: Press
permalink: /press/
---

{% assign sorted_press = site.press | sort: "date" | reverse %}

{% if sorted_press.size == 0 %}
<p class="muted">No press coverage listed yet.</p>
{% endif %}

<ul class="press-list">
{% for item in sorted_press %}
  <li class="press-item">
    <div class="press-date">{{ item.date | date: "%B %Y" }}</div>
    <div class="press-outlet">{{ item.outlet }}</div>
    <div class="press-title">
      {% if item.link %}
        <a href="{{ item.link }}">{{ item.title }}</a>
      {% else %}
        {{ item.title }}
      {% endif %}
    </div>
    {% assign quote = item.content | strip %}
    {% if quote != "" %}
      <blockquote class="press-quote">{{ quote | markdownify }}</blockquote>
    {% endif %}
  </li>
{% endfor %}
</ul>
