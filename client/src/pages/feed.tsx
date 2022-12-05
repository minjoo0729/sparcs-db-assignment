import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import "./css/feed.css";
import EditFeed from "./editfeed";

interface IAPIResponse  { _id: string, title: string, content: string, itemViewCnt: number }

const FeedPage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);
  const [ SNewPostTitle, setSNewPostTitle ] = React.useState<string>("");
  const [ SNewPostContent, setSNewPostContent ] = React.useState<string>("");
  const [ SSearchItem, setSSearchItem ] = React.useState<string>("");
  const [ Edited, setEdited ] = React.useState<boolean>(false);
  
  React.useEffect( () => {
    if ( Edited ) setEdited(false);
    else {
      let BComponentExited = false;
      const asyncFun = async () => {
        const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/feed/getFeed?count=${ NPostCount }`);
        console.log(data);
        if (BComponentExited) return;
        setLAPIResponse(data);
      };
      asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
      return () => { BComponentExited = true; }
    }
  }, [ NPostCount, Edited ]);

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/addFeed', { title: SNewPostTitle, content: SNewPostContent } );
      setNPostCount(NPostCount + 1);
      setSNewPostTitle("");
      setSNewPostContent("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/feed/deleteFeed', { id: id } );
      setNPostCount(Math.max(NPostCount - 1, 0));
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const editPost = (id:string, title:string, content:string) => {
    const asyncFun = async () => {
      await axios.put( SAPIBase + '/feed/editFeed', { id, title, content } );
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
    setEdited(true);
  }

  return (
    <div className="Feed">
      <Header/>
      <h2>Feed</h2>
      <div className={"feed-length-input"}>
        Number of posts to show: &nbsp;&nbsp;
        <input type={"number"} value={ NPostCount } id={"post-count-input"} min={0}
               onChange={ (e) => setNPostCount( parseInt(e.target.value) ) }
        />
      </div>
      <div className={"feed-length-input"}>
        Search Keyword: &nbsp;&nbsp;
        <input type={"text"} value={ SSearchItem } id={"post-search-input"}
               onChange={ (e) => setSSearchItem( e.target.value ) }
        />
      </div>
      <div className={"feed-list"}>
        { LAPIResponse.map( (val, i) =>
          <EditFeed val={val} i={i} deletePost={deletePost} editPost={editPost} />
        ) }
        <div className={"feed-item-add"}>
          Title: <input type={"text"} value={SNewPostTitle} onChange={(e) => setSNewPostTitle(e.target.value)}/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          Content: <input type={"text"} value={SNewPostContent} onChange={(e) => setSNewPostContent(e.target.value)}/>
          <div className={"post-add-button"} onClick={(e) => createNewPost()}>Add Post!</div>
        </div>
      </div>
    </div>
  );
}
export default FeedPage;