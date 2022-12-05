import React, {useState, useEffect} from "react";

const EditFeed = ({ val, i, deletePost, editPost }:{ val:any, i:any, deletePost:any, editPost:any }) => {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ ID, setID ] = useState(val.id);
  const [ postTitle, setPostTitle ] = useState(val.title);
  const [ postContent, setPostContent ] = useState(val.content);

  if( val.id !== ID ) {
    setID(val.id);
    setIsEditing(false);
    setPostTitle(val.title);
    setPostContent(val.content);
  }

  useEffect(() => {
    if( !isEditing ) { 
      editPost(ID, postTitle, postContent);
    } // eslint-disable-next-line
  }, [ isEditing ]);

  return (
    isEditing ?
    (<div key={i} className={"feed-item"}>
      <div className={"delete-item"} onClick={(e) => deletePost(`${ID}`)}>ⓧ</div>
      <button className={"edit-item"} onClick={(e) => setIsEditing(!isEditing)}>Save</button>
      <h3>
        <input className={"feed-title"} type={"text"} value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
      </h3>
      <p>
        <input className={"feed-body"} type={"text"} value={postContent} onChange={(e) => setPostContent(e.target.value)}/>
      </p>
    </div>) :
    (<div key={i} className={"feed-item"}>
        <button className={"delete-item"} onClick={(e) => setIsEditing(!isEditing)}>Delete</button>
        <button className={"edit-item"} onClick={(e) => setIsEditing(!isEditing)}>Edit</button>
        <h2 className={"feed-title"}>{ postTitle }</h2>
        <p className={"feed-body"}>{ postContent }</p>
    </div>)
  )
}

export default EditFeed;