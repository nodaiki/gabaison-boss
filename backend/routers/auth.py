from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from datetime import timedelta
from database import get_db
from schemas.user import UserCreate, UserResponse, LoginRequest
from crud.user import get_user_by_email, create_user
from security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
import models

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")
    return create_user(db=db, user=user)

@router.post("/login")
def login(response: Response, login_data: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=login_data.email)
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが間違っています"
        )
    
    # JWTトークン生成 (subにはUUIDを文字列化して格納)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    # HTTP-only Cookieにトークンをセット
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # JavaScriptからのアクセスを禁止
        secure=False,   # 本番環境(HTTPS)ではTrueに変更してください
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    return {"message": "ログインに成功しました"}

@router.post("/logout")
def logout(response: Response):
    # Cookieを削除してログアウト
    response.delete_cookie(key="access_token", httponly=True, samesite="lax")
    return {"message": "ログアウトしました"}

# 動作確認用: 現在ログインしているユーザー情報を取得するエンドポイント
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user