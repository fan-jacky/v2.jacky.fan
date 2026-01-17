import { ActiveLink } from "@/components/basic";

function getTextStyles(text: any, attrs: any = {}) {
  if (!text) return null;
  
  if (text.bold == true) {
    return <strong {...attrs} key={attrs.key ?? ""}>{text.text}</strong>;
  }
  if (text.italic == true) {
    return <i {...attrs} key={attrs.key ?? ""}>{text.text}</i>;
  }
  if (text.underline == true) {
    return <u {...attrs} key={attrs.key ?? ""}>{text.text}</u>;
  }
  if (text.strikethrough == true) {
    return <s {...attrs} key={attrs.key ?? ""}>{text.text}</s>;
  }
  if (text.code == true) {
    return <code {...attrs} key={attrs.key ?? ""}>{text.text}</code>;
  }
  if (text.url && text.children) {
    return <ActiveLink {...attrs} key={attrs.key ?? ""} href={text.url}>{text.children.map((c:any) => getTextStyles(c))}</ActiveLink>;
  }
  return text.text ?? null;
}

function getList(list: any, key: number) {

  if (list.type == "list") {
    const { format, children } = list;

    // process children for nested lists

    // if previous list item exist then move list to previous list item
    // if not exist then create new list item and add list to it
    const listChildren = [...children];
    listChildren.forEach((c: any, index: number) => {
      if (c.type == "list") {
        if (index > 0) {
          if (listChildren[index - 1].type == "list-item") {
            listChildren[index - 1].children.push(c);
            listChildren.splice(index, 1);
          }
        } else {
          listChildren[index] = {
            type: "list-item",
            children: [c],
          };
        }
      }
    });

    const elements = listChildren.map((c: any, i: number) => {
      if (c.type.includes("list")) {
        return getList(c, i);
      } else {
        return getTextStyles(c, { key: i });
      }
    });

    if (format == "unordered") {
      return <ul key={key}>{elements}</ul>;
    } else {
      return <ol key={key}>{elements}</ol>;
    }

  }

  if (list.type == "list-item") {
    const { children } = list;

    const elements = children.map((c: any, i: number) => {
      if (c.type.includes("list")) {
        return getList(c, i);
      } else {
        return getTextStyles(c, { key: i });
      }
    });

    return <li key={key}>{elements}</li>;
  }

  return null;

}

function getRichTextBlocks(block: any, attrs: any = {}, key: number) {
  if (!block || !block.type) return null;

  if (block.type == "heading") {
    const { level, children } = block;

    const elements = children.map((c: any, i: number) => {
      return getTextStyles(c, { key: i });
    });

    if (level == 1) {
      return <h1 key={key}>{elements}</h1>;
    }
    if (level == 2) {
      return <h2 key={key}>{elements}</h2>;
    }
    if (level == 3) {
      return <h3 key={key}>{elements}</h3>;
    }
    if (level == 4) {
      return <h4 key={key}>{elements}</h4>;
    }
    if (level == 5) {
      return <h5 key={key}>{elements}</h5>;
    }
    if (level == 6) {
      return <h6 key={key}>{elements}</h6>;
    }
  }

  if (block.type == "paragraph") {
    const { children } = block;

    const elements = children.map((c: any, i: number) => {
      return getTextStyles(c, { key: i });
    });

    return <p {...attrs} key={key}>{elements}</p>;
  }

  if (block.type == "code") {
    const { children } = block;

    const elements = children.map((c: any, i: number) => {
      return getTextStyles(c, { key: i });
    });

    return <code key={key}>{ elements }</code>
  }
  
  if (block.type == "quote") {
    const { children } = block;

    const elements = children.map((c: any, i: number) => {
      return getTextStyles(c, { key: i });
    });

    return <blockquote key={key}>{ elements }</blockquote>
  }

  if (block.type == "list") {
    return getList(block, key);
  }

  return null
}

export { getRichTextBlocks };
