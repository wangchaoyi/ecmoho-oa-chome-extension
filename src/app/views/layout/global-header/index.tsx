import HeaderSearch from "ant-design-pro/lib/HeaderSearch";
// import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import { Avatar, Button, Dropdown, Icon, Menu, message, Spin, Tag } from "antd";
import { groupBy } from "lodash";
import Debounce from "lodash-decorators/debounce";
import { inject, observer } from "mobx-react";
import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import { User } from "../../../store";
import styles from "./style.less";
import NoticeIcon from "ant-design-pro/lib/NoticeIcon";

interface IGlobalHeaderProp {
  notices?: any[];
  collapsed?: any;
  onCollapse?: any;

  currentUser?: any;
  fetchingNotices?: any;
  isMobile?: any;
  logo?: any;
  onNoticeVisibleChange?: any;
  onMenuClick?: any;
  onNoticeClear?: any;

  userStore?: User;
}

@inject("userStore")
@observer
export default class GlobalHeader extends React.Component<
  IGlobalHeaderProp,
  {}
> {
  public componentWillUnmount() {
    // this.triggerResizeEvent.cancel();
  }

  public getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice: any) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      // if (newNotice.extra && newNotice.status) {
      //   const color: any = {
      //     doing: "gold",
      //     processing: "blue",
      //     urgent: "red"
      //   }[newNotice.status];
      //   newNotice.extra = (
      //     <Tag color={color} style={{ marginRight: 0 }}>
      //       {newNotice.extra}
      //     </Tag>
      //   );
      // }
      return newNotice;
    });
    return groupBy(newNotices, "type");
  }

  public handleSearch = () => {
    message.warning("搜索功能暂未开放，敬请期待");
  };

  public toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  /* eslint-disable*/
  @Debounce(600)
  public triggerResizeEvent() {
    const event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, false);
    window.dispatchEvent(event);
  }

  public render() {
    const {
      onMenuClick
      // onNoticeClear,
    } = this.props;

    const userMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled={true}>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item>
          <Link to={"/setting"}>
            <Icon type="setting" />设置
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Link to={"/logout"}>
            <Icon type="close" />退出登录
          </Link>
        </Menu.Item>
      </Menu>
    );

    const addMenu = (
      <Menu className={styles.menu}>
        <Menu.Item>
          <Link to={"/approve/add/overtime"}>
            <Icon type="user" />申请加班
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={"/member/customer/add"}>
            <Icon type="user" /> 请假
          </Link>
        </Menu.Item>
      </Menu>
    );

    const headerSearchProps: any = {
      className: `${styles.action} ${styles.search}`
    };

    // const noticeData:any = this.getNoticeData();
    return (
      <div className={styles.header}>
        <div className={styles.left}>
          <Link className={styles.logo} to={"/"}>
            {/*薪人薪事*/}
          </Link>
          {/*<img src={logo} alt="logo" width="32"/>*/}
          &nbsp;&nbsp;&nbsp;
        </div>

        <div className={styles.right}>
          <HeaderSearch
            {...headerSearchProps}
            placeholder="站内搜索"
            onPressEnter={this.handleSearch}
            // dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            // onSearch={value => {
            //   console.log('input', value); // eslint-disable-line
            // }}
            // onPressEnter={value => {
            //   console.log('enter', value); // eslint-disable-line
            // }}
          />
          <Dropdown overlay={addMenu}>
            <a className={styles.action}>
              <Button shape={"circle"} size={"small"}>
                <Icon type={"plus"} />
              </Button>
            </a>
          </Dropdown>

          <Link className={styles.action} to="/">
            首页
          </Link>
          
          <Link className={styles.action} to="/approve">
            审批列表
          </Link>

          <a target="_blank" className={styles.action}>
            帮助
          </a>

          <NoticeIcon
            className={styles.action}
            count={0}
            onItemClick={(item: any, tabProps: any) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            // onClear={onNoticeClear}
            // onPopupVisibleChange={onNoticeVisibleChange}
            loading={false}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={[]}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={[]}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={[]}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
          {this.props.userStore && (
            <Dropdown overlay={userMenu}>
              <span className={`${styles.action} ${styles.account}`}>
                {/*<Avatar*/}
                {/*size="small"*/}
                {/*className={styles.avatar}*/}
                {/*src={*/}
                {/*this.props.userStore &&*/}
                {/*(this.props.userStore.user.face || defaultAvatar)*/}
                {/*}*/}
                {/*/>*/}
                <span className={styles.name}>
                  {this.props.userStore &&
                    (this.props.userStore.user.userName || "")}
                </span>
              </span>
            </Dropdown>
          )}

          <Spin size="small" style={{ marginLeft: 8 }} />
        </div>
      </div>
    );
  }
}
