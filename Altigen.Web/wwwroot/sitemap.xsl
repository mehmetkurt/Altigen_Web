<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>XML Sitemap</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 2rem;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 1rem;
          }
          p.desc {
            color: #6c757d;
            margin-bottom: 2rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          th, td {
            text-align: left;
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #495057;
          }
          tr:hover {
            background-color: #f1f3f5;
          }
          a {
            color: #007bff;
            text-decoration: none;
            transition: color 0.2s;
          }
          a:hover {
            color: #0056b3;
            text-decoration: underline;
          }
          .mono {
            font-family: monospace;
            color: #d63384;
          }
          .lang-badge {
            display: inline-block;
            background: #e9ecef;
            color: #495057;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
            margin-right: 0.5rem;
            margin-bottom: 0.25rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemap</h1>
          <p class="desc">
            This sitemap contains <strong class="mono"><xsl:value-of select="count(s:urlset/s:url)"/></strong> URLs.
            It is generated automatically by Umbraco to help search engines index the content.
          </p>
          <table>
            <thead>
              <tr>
                <th style="width: 50%">URL</th>
                <th style="width: 20%">Last Modified</th>
                <th style="width: 30%">Alternate Languages</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td>
                    <a href="{s:loc}" target="_blank">
                      <xsl:value-of select="s:loc" />
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="substring(s:lastmod, 1, 19)" />
                  </td>
                  <td>
                    <xsl:for-each select="xhtml:link">
                      <a href="{@href}" class="lang-badge" target="_blank">
                        <xsl:value-of select="@hreflang" />
                      </a>
                    </xsl:for-each>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
